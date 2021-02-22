package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Provider;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Provider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
}
