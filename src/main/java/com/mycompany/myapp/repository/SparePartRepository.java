package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SparePart;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the SparePart entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
}
