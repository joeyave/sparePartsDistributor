package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Delivery;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Delivery} entity.
 */
public interface DeliverySearchRepository extends ElasticsearchRepository<Delivery, Long> {
}
