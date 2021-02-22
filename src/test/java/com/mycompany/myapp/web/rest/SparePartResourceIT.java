package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.SparePartsDistributorApp;
import com.mycompany.myapp.domain.SparePart;
import com.mycompany.myapp.repository.SparePartRepository;
import com.mycompany.myapp.repository.search.SparePartSearchRepository;

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
 * Integration tests for the {@link SparePartResource} REST controller.
 */
@SpringBootTest(classes = SparePartsDistributorApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class SparePartResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TERM = "AAAAAAAAAA";
    private static final String UPDATED_TERM = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    @Autowired
    private SparePartRepository sparePartRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.SparePartSearchRepositoryMockConfiguration
     */
    @Autowired
    private SparePartSearchRepository mockSparePartSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSparePartMockMvc;

    private SparePart sparePart;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SparePart createEntity(EntityManager em) {
        SparePart sparePart = new SparePart()
            .name(DEFAULT_NAME)
            .term(DEFAULT_TERM)
            .price(DEFAULT_PRICE)
            .note(DEFAULT_NOTE);
        return sparePart;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SparePart createUpdatedEntity(EntityManager em) {
        SparePart sparePart = new SparePart()
            .name(UPDATED_NAME)
            .term(UPDATED_TERM)
            .price(UPDATED_PRICE)
            .note(UPDATED_NOTE);
        return sparePart;
    }

    @BeforeEach
    public void initTest() {
        sparePart = createEntity(em);
    }

    @Test
    @Transactional
    public void createSparePart() throws Exception {
        int databaseSizeBeforeCreate = sparePartRepository.findAll().size();
        // Create the SparePart
        restSparePartMockMvc.perform(post("/api/spare-parts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sparePart)))
            .andExpect(status().isCreated());

        // Validate the SparePart in the database
        List<SparePart> sparePartList = sparePartRepository.findAll();
        assertThat(sparePartList).hasSize(databaseSizeBeforeCreate + 1);
        SparePart testSparePart = sparePartList.get(sparePartList.size() - 1);
        assertThat(testSparePart.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSparePart.getTerm()).isEqualTo(DEFAULT_TERM);
        assertThat(testSparePart.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testSparePart.getNote()).isEqualTo(DEFAULT_NOTE);

        // Validate the SparePart in Elasticsearch
        verify(mockSparePartSearchRepository, times(1)).save(testSparePart);
    }

    @Test
    @Transactional
    public void createSparePartWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sparePartRepository.findAll().size();

        // Create the SparePart with an existing ID
        sparePart.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSparePartMockMvc.perform(post("/api/spare-parts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sparePart)))
            .andExpect(status().isBadRequest());

        // Validate the SparePart in the database
        List<SparePart> sparePartList = sparePartRepository.findAll();
        assertThat(sparePartList).hasSize(databaseSizeBeforeCreate);

        // Validate the SparePart in Elasticsearch
        verify(mockSparePartSearchRepository, times(0)).save(sparePart);
    }


    @Test
    @Transactional
    public void getAllSpareParts() throws Exception {
        // Initialize the database
        sparePartRepository.saveAndFlush(sparePart);

        // Get all the sparePartList
        restSparePartMockMvc.perform(get("/api/spare-parts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sparePart.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].term").value(hasItem(DEFAULT_TERM)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }
    
    @Test
    @Transactional
    public void getSparePart() throws Exception {
        // Initialize the database
        sparePartRepository.saveAndFlush(sparePart);

        // Get the sparePart
        restSparePartMockMvc.perform(get("/api/spare-parts/{id}", sparePart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sparePart.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.term").value(DEFAULT_TERM))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE));
    }
    @Test
    @Transactional
    public void getNonExistingSparePart() throws Exception {
        // Get the sparePart
        restSparePartMockMvc.perform(get("/api/spare-parts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSparePart() throws Exception {
        // Initialize the database
        sparePartRepository.saveAndFlush(sparePart);

        int databaseSizeBeforeUpdate = sparePartRepository.findAll().size();

        // Update the sparePart
        SparePart updatedSparePart = sparePartRepository.findById(sparePart.getId()).get();
        // Disconnect from session so that the updates on updatedSparePart are not directly saved in db
        em.detach(updatedSparePart);
        updatedSparePart
            .name(UPDATED_NAME)
            .term(UPDATED_TERM)
            .price(UPDATED_PRICE)
            .note(UPDATED_NOTE);

        restSparePartMockMvc.perform(put("/api/spare-parts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSparePart)))
            .andExpect(status().isOk());

        // Validate the SparePart in the database
        List<SparePart> sparePartList = sparePartRepository.findAll();
        assertThat(sparePartList).hasSize(databaseSizeBeforeUpdate);
        SparePart testSparePart = sparePartList.get(sparePartList.size() - 1);
        assertThat(testSparePart.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSparePart.getTerm()).isEqualTo(UPDATED_TERM);
        assertThat(testSparePart.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testSparePart.getNote()).isEqualTo(UPDATED_NOTE);

        // Validate the SparePart in Elasticsearch
        verify(mockSparePartSearchRepository, times(1)).save(testSparePart);
    }

    @Test
    @Transactional
    public void updateNonExistingSparePart() throws Exception {
        int databaseSizeBeforeUpdate = sparePartRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSparePartMockMvc.perform(put("/api/spare-parts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(sparePart)))
            .andExpect(status().isBadRequest());

        // Validate the SparePart in the database
        List<SparePart> sparePartList = sparePartRepository.findAll();
        assertThat(sparePartList).hasSize(databaseSizeBeforeUpdate);

        // Validate the SparePart in Elasticsearch
        verify(mockSparePartSearchRepository, times(0)).save(sparePart);
    }

    @Test
    @Transactional
    public void deleteSparePart() throws Exception {
        // Initialize the database
        sparePartRepository.saveAndFlush(sparePart);

        int databaseSizeBeforeDelete = sparePartRepository.findAll().size();

        // Delete the sparePart
        restSparePartMockMvc.perform(delete("/api/spare-parts/{id}", sparePart.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SparePart> sparePartList = sparePartRepository.findAll();
        assertThat(sparePartList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the SparePart in Elasticsearch
        verify(mockSparePartSearchRepository, times(1)).deleteById(sparePart.getId());
    }

    @Test
    @Transactional
    public void searchSparePart() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        sparePartRepository.saveAndFlush(sparePart);
        when(mockSparePartSearchRepository.search(queryStringQuery("id:" + sparePart.getId())))
            .thenReturn(Collections.singletonList(sparePart));

        // Search the sparePart
        restSparePartMockMvc.perform(get("/api/_search/spare-parts?query=id:" + sparePart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sparePart.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].term").value(hasItem(DEFAULT_TERM)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)));
    }
}
