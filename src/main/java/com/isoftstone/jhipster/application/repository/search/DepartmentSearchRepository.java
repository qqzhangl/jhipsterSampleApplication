package com.isoftstone.jhipster.application.repository.search;

import com.isoftstone.jhipster.application.domain.Department;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Department entity.
 */
public interface DepartmentSearchRepository extends ElasticsearchRepository<Department, Long> {
}
