package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SparePart;
import com.mycompany.myapp.repository.SparePartRepository;
import com.mycompany.myapp.repository.search.SparePartSearchRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.SparePart}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SparePartResource {

    private final Logger log = LoggerFactory.getLogger(SparePartResource.class);

    private static final String ENTITY_NAME = "sparePart";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SparePartRepository sparePartRepository;

    private final SparePartSearchRepository sparePartSearchRepository;

    public SparePartResource(SparePartRepository sparePartRepository, SparePartSearchRepository sparePartSearchRepository) {
        this.sparePartRepository = sparePartRepository;
        this.sparePartSearchRepository = sparePartSearchRepository;
    }

    /**
     * {@code POST  /spare-parts} : Create a new sparePart.
     *
     * @param sparePart the sparePart to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sparePart, or with status {@code 400 (Bad Request)} if the sparePart has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/spare-parts")
    public ResponseEntity<SparePart> createSparePart(@RequestBody SparePart sparePart) throws URISyntaxException {
        log.debug("REST request to save SparePart : {}", sparePart);
        if (sparePart.getId() != null) {
            throw new BadRequestAlertException("A new sparePart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SparePart result = sparePartRepository.save(sparePart);
        sparePartSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/spare-parts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /spare-parts} : Updates an existing sparePart.
     *
     * @param sparePart the sparePart to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sparePart,
     * or with status {@code 400 (Bad Request)} if the sparePart is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sparePart couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/spare-parts")
    public ResponseEntity<SparePart> updateSparePart(@RequestBody SparePart sparePart) throws URISyntaxException {
        log.debug("REST request to update SparePart : {}", sparePart);
        if (sparePart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SparePart result = sparePartRepository.save(sparePart);
        sparePartSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sparePart.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /spare-parts} : get all the spareParts.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of spareParts in body.
     */
    @GetMapping("/spare-parts")
    public List<SparePart> getAllSpareParts(@RequestParam(required = false) String filter) {
        if ("delivery-is-null".equals(filter)) {
            log.debug("REST request to get all SpareParts where delivery is null");
            return StreamSupport
                .stream(sparePartRepository.findAll().spliterator(), false)
                .filter(sparePart -> sparePart.getDelivery() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all SpareParts");
        return sparePartRepository.findAll();
    }

    /**
     * {@code GET  /spare-parts/:id} : get the "id" sparePart.
     *
     * @param id the id of the sparePart to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sparePart, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/spare-parts/{id}")
    public ResponseEntity<SparePart> getSparePart(@PathVariable Long id) {
        log.debug("REST request to get SparePart : {}", id);
        Optional<SparePart> sparePart = sparePartRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sparePart);
    }

    /**
     * {@code DELETE  /spare-parts/:id} : delete the "id" sparePart.
     *
     * @param id the id of the sparePart to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/spare-parts/{id}")
    public ResponseEntity<Void> deleteSparePart(@PathVariable Long id) {
        log.debug("REST request to delete SparePart : {}", id);
        sparePartRepository.deleteById(id);
        sparePartSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/spare-parts?query=:query} : search for the sparePart corresponding
     * to the query.
     *
     * @param query the query of the sparePart search.
     * @return the result of the search.
     */
    @GetMapping("/_search/spare-parts")
    public List<SparePart> searchSpareParts(@RequestParam String query) {
        log.debug("REST request to search SpareParts for query {}", query);
        return StreamSupport
            .stream(sparePartSearchRepository.search(queryStringQuery(query)).spliterator(), false)
        .collect(Collectors.toList());
    }
}
