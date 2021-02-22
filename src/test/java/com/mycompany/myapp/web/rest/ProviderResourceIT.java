package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.SparePartsDistributorApp;
import com.mycompany.myapp.domain.Provider;
import com.mycompany.myapp.repository.ProviderRepository;
import com.mycompany.myapp.repository.search.ProviderSearchRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ProviderResource} REST controller.
 */
@SpringBootTest(classes = SparePartsDistributorApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class ProviderResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    @Autowired
    private ProviderRepository providerRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.ProviderSearchRepositoryMockConfiguration
     */
    @Autowired
    private ProviderSearchRepository mockProviderSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProviderMockMvc;

    private Provider provider;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Provider createEntity(EntityManager em) {
        Provider provider = new Provider()
            .name(DEFAULT_NAME)
            .address(DEFAULT_ADDRESS)
            .phone(DEFAULT_PHONE);
        return provider;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Provider createUpdatedEntity(EntityManager em) {
        Provider provider = new Provider()
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .phone(UPDATED_PHONE);
        return provider;
    }

    @BeforeEach
    public void initTest() {
        provider = createEntity(em);
    }

    @Test
    @Transactional
    public void createProvider() throws Exception {
        int databaseSizeBeforeCreate = providerRepository.findAll().size();
        // Create the Provider
        restProviderMockMvc.perform(post("/api/providers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provider)))
            .andExpect(status().isCreated());

        // Validate the Provider in the database
        List<Provider> providerList = providerRepository.findAll();
        assertThat(providerList).hasSize(databaseSizeBeforeCreate + 1);
        Provider testProvider = providerList.get(providerList.size() - 1);
        assertThat(testProvider.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProvider.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testProvider.getPhone()).isEqualTo(DEFAULT_PHONE);

        // Validate the Provider in Elasticsearch
        verify(mockProviderSearchRepository, times(1)).save(testProvider);
    }

    @Test
    @Transactional
    public void createProviderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = providerRepository.findAll().size();

        // Create the Provider with an existing ID
        provider.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProviderMockMvc.perform(post("/api/providers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provider)))
            .andExpect(status().isBadRequest());

        // Validate the Provider in the database
        List<Provider> providerList = providerRepository.findAll();
        assertThat(providerList).hasSize(databaseSizeBeforeCreate);

        // Validate the Provider in Elasticsearch
        verify(mockProviderSearchRepository, times(0)).save(provider);
    }


    @Test
    @Transactional
    public void getAllProviders() throws Exception {
        // Initialize the database
        providerRepository.saveAndFlush(provider);

        // Get all the providerList
        restProviderMockMvc.perform(get("/api/providers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(provider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }
    
    @Test
    @Transactional
    public void getProvider() throws Exception {
        // Initialize the database
        providerRepository.saveAndFlush(provider);

        // Get the provider
        restProviderMockMvc.perform(get("/api/providers/{id}", provider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(provider.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }
    @Test
    @Transactional
    public void getNonExistingProvider() throws Exception {
        // Get the provider
        restProviderMockMvc.perform(get("/api/providers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProvider() throws Exception {
        // Initialize the database
        providerRepository.saveAndFlush(provider);

        int databaseSizeBeforeUpdate = providerRepository.findAll().size();

        // Update the provider
        Provider updatedProvider = providerRepository.findById(provider.getId()).get();
        // Disconnect from session so that the updates on updatedProvider are not directly saved in db
        em.detach(updatedProvider);
        updatedProvider
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .phone(UPDATED_PHONE);

        restProviderMockMvc.perform(put("/api/providers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedProvider)))
            .andExpect(status().isOk());

        // Validate the Provider in the database
        List<Provider> providerList = providerRepository.findAll();
        assertThat(providerList).hasSize(databaseSizeBeforeUpdate);
        Provider testProvider = providerList.get(providerList.size() - 1);
        assertThat(testProvider.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProvider.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testProvider.getPhone()).isEqualTo(UPDATED_PHONE);

        // Validate the Provider in Elasticsearch
        verify(mockProviderSearchRepository, times(1)).save(testProvider);
    }

    @Test
    @Transactional
    public void updateNonExistingProvider() throws Exception {
        int databaseSizeBeforeUpdate = providerRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProviderMockMvc.perform(put("/api/providers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(provider)))
            .andExpect(status().isBadRequest());

        // Validate the Provider in the database
        List<Provider> providerList = providerRepository.findAll();
        assertThat(providerList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Provider in Elasticsearch
        verify(mockProviderSearchRepository, times(0)).save(provider);
    }

    @Test
    @Transactional
    public void deleteProvider() throws Exception {
        // Initialize the database
        providerRepository.saveAndFlush(provider);

        int databaseSizeBeforeDelete = providerRepository.findAll().size();

        // Delete the provider
        restProviderMockMvc.perform(delete("/api/providers/{id}", provider.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Provider> providerList = providerRepository.findAll();
        assertThat(providerList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Provider in Elasticsearch
        verify(mockProviderSearchRepository, times(1)).deleteById(provider.getId());
    }

    @Test
    @Transactional
    public void searchProvider() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        providerRepository.saveAndFlush(provider);
        when(mockProviderSearchRepository.search(queryStringQuery("id:" + provider.getId())))
            .thenReturn(Collections.singletonList(provider));

        // Search the provider
        restProviderMockMvc.perform(get("/api/_search/providers?query=id:" + provider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(provider.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }
}
