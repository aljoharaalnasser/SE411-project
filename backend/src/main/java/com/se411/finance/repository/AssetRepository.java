package com.se411.finance.repository;

import com.se411.finance.model.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySymbolIgnoreCase(String symbol);

    @Query("select a from Asset a where "
            + "(lower(a.symbol) like lower(concat('%', :search, '%')) "
            + "or lower(a.company) like lower(concat('%', :search, '%'))) "
            + "and (:type = '' or a.type = :type)")
    Page<Asset> search(@Param("search") String search, @Param("type") String type, Pageable pageable);
}
