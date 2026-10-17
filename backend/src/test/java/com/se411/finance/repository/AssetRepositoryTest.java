package com.se411.finance.repository;

import com.se411.finance.model.Asset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class AssetRepositoryTest {

    @Autowired
    private AssetRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        repository.save(new Asset(null, "AAPL", "Apple Inc.", "Stock", 10, 1000.0));
        repository.save(new Asset(null, "TSLA", "Tesla Inc.", "Stock", 5, 500.0));
        repository.save(new Asset(null, "UST10", "US Treasury Note", "Bond", 20, 2000.0));
        repository.save(new Asset(null, "MUNI1", "City Municipal Bond", "Bond", 8, 800.0));
    }

    @Test
    void saveGivesNewAssetAnId() {
        Asset saved = repository.save(new Asset(null, "NEW1", "New Company", "Stock", 1, 10.0));

        assertNotNull(saved.getId());
        assertEquals(5, repository.count());
    }

    @Test
    void findBySymbolIgnoreCaseFindsTheAsset() {
        Optional<Asset> found = repository.findBySymbolIgnoreCase("aapl");

        assertTrue(found.isPresent());
        assertEquals("Apple Inc.", found.get().getCompany());
    }

    @Test
    void findBySymbolIgnoreCaseReturnsEmptyWhenMissing() {
        assertFalse(repository.findBySymbolIgnoreCase("NOPE").isPresent());
    }

    @Test
    void searchWithEmptyTextAndTypeReturnsEverything() {
        Page<Asset> result = repository.search("", "", PageRequest.of(0, 10));

        assertEquals(4, result.getTotalElements());
    }

    @Test
    void searchMatchesTheSymbolIgnoringCase() {
        Page<Asset> result = repository.search("ust", "", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("UST10", result.getContent().get(0).getSymbol());
    }

    @Test
    void searchMatchesTheCompanyName() {
        Page<Asset> result = repository.search("municipal", "", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals("MUNI1", result.getContent().get(0).getSymbol());
    }

    @Test
    void searchFiltersByType() {
        Page<Asset> bonds = repository.search("", "Bond", PageRequest.of(0, 10));
        Page<Asset> stocks = repository.search("", "Stock", PageRequest.of(0, 10));

        assertEquals(2, bonds.getTotalElements());
        assertEquals(2, stocks.getTotalElements());
    }

    @Test
    void searchCanUseTextAndTypeTogether() {
        Page<Asset> result = repository.search("inc", "Stock", PageRequest.of(0, 10));

        assertEquals(2, result.getTotalElements());
    }

    @Test
    void searchSplitsTheResultIntoPages() {
        Page<Asset> firstPage = repository.search("", "", PageRequest.of(0, 3));
        Page<Asset> secondPage = repository.search("", "", PageRequest.of(1, 3));

        assertEquals(3, firstPage.getContent().size());
        assertEquals(1, secondPage.getContent().size());
        assertEquals(2, firstPage.getTotalPages());
        assertEquals(4, firstPage.getTotalElements());
    }

    @Test
    void deleteByIdRemovesTheAsset() {
        Long id = repository.findBySymbolIgnoreCase("AAPL").get().getId();

        repository.deleteById(id);

        assertFalse(repository.existsById(id));
        assertEquals(3, repository.count());
    }
}
