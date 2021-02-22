package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Provider;
import com.mycompany.myapp.repository.ProviderRepository;
import com.mycompany.myapp.repository.search.ProviderSearchRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Provider}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProviderResource {

    private final Logger log = LoggerFactory.getLogger(ProviderResource.class);

    private static final String ENTITY_NAME = "provider";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProviderRepository providerRepository;

    private final ProviderSearchRepository providerSearchRepository;

    public ProviderResource(ProviderRepository providerRepository, ProviderSearchRepository providerSearchRepository) {
        this.providerRepository = providerRepository;
        this.providerSearchRepository = providerSearchRepository;
    }

    /**
     * {@code POST  /providers} : Create a new provider.
     *
     * @param provider the provider to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new provider, or with status {@code 400 (Bad Request)} if the provider has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/providers")
    public ResponseEntity<Provider> createProvider(@RequestBody Provider provider) throws URISyntaxException {
        log.debug("REST request to save Provider : {}", provider);
        if (provider.getId() != null) {
            throw new BadRequestAlertException("A new provider cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Provider result = providerRepository.save(provider);
        providerSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/providers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /providers} : Updates an existing provider.
     *
     * @param provider the provider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated provider,
     * or with status {@code 400 (Bad Request)} if the provider is not valid,
     * or with status {@code 500 (Internal Server Error)} if the provider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/providers")
    public ResponseEntity<Provider> updateProvider(@RequestBody Provider provider) throws URISyntaxException {
        log.debug("REST request to update Provider : {}", provider);
        if (provider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Provider result = providerRepository.save(provider);
        providerSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, provider.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /providers} : get all the providers.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of providers in body.
     */
    @GetMapping("/providers")
    public List<Provider> getAllProviders(@RequestParam(required = false) String filter) {
        if ("delivery-is-null".equals(filter)) {
            log.debug("REST request to get all Providers where delivery is null");
            return StreamSupport
                .stream(providerRepository.findAll().spliterator(), false)
                .filter(provider -> provider.getDelivery() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Providers");
        return providerRepository.findAll();
    }

    /**
     * {@code GET  /providers/:id} : get the "id" provider.
     *
     * @param id the id of the provider to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the provider, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/providers/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable Long id) {
        log.debug("REST request to get Provider : {}", id);
        Optional<Provider> provider = providerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(provider);
    }

    /**
     * {@code DELETE  /providers/:id} : delete the "id" provider.
     *
     * @param id the id of the provider to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/providers/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        log.debug("REST request to delete Provider : {}", id);
        providerRepository.deleteById(id);
        providerSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/providers?query=:query} : search for the provider corresponding
     * to the query.
     *
     * @param query the query of the provider search.
     * @return the result of the search.
     */
    @GetMapping("/_search/providers")
    public List<Provider> searchProviders(@RequestParam String query) {
        log.debug("REST request to search Providers for query {}", query);
        return StreamSupport
            .stream(providerSearchRepository.search(queryStringQuery(query)).spliterator(), false)
        .collect(Collectors.toList());
    }
}
