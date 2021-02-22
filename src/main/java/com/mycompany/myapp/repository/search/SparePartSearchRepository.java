package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.SparePart;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link SparePart} entity.
 */
public interface SparePartSearchRepository extends ElasticsearchRepository<SparePart, Long> {
}
