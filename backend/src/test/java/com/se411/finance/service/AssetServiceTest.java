package com.se411.finance.service;

import com.se411.finance.dto.PageResponse;
import com.se411.finance.exception.AssetNotFoundException;
import com.se411.finance.exception.DuplicateSymbolException;
import com.se411.finance.model.Asset;
import com.se411.finance.repository.AssetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    @Mock
    private AssetRepository repository;

    @InjectMocks
    private AssetService service;

    private Asset makeAsset(Long id, String symbol, String type) {
        return new Asset(id, symbol, "Company " + symbol, type, 10, 1200.0);
    }

    private List<Asset> makeAssets(int count) {
        List<Asset> list = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            list.add(makeAsset((long) i, "SYM" + i, "Stock"));
        }
        return list;
    }

    @Test
    void addAssetSavesNewAsset() {
        Asset asset = makeAsset(null, "NEW1", "Stock");
        when(repository.findBySymbolIgnoreCase("NEW1")).thenReturn(Optional.empty());
        when(repository.save(asset)).thenReturn(makeAsset(11L, "NEW1", "Stock"));

        Asset saved = service.addAsset(asset);

        assertEquals(11L, saved.getId());
        verify(repository).save(asset);
    }

    @Test
    void addAssetWithExistingSymbolThrowsException() {
        Asset asset = makeAsset(null, "AAPL", "Stock");
        when(repository.findBySymbolIgnoreCase("AAPL")).thenReturn(Optional.of(makeAsset(1L, "AAPL", "Stock")));

        assertThrows(DuplicateSymbolException.class, () -> service.addAsset(asset));
        verify(repository, never()).save(any());
    }

    @Test
    void getAssetByIdReturnsAsset() {
        when(repository.findById(1L)).thenReturn(Optional.of(makeAsset(1L, "AAPL", "Stock")));

        Asset found = service.getAssetById(1L);

        assertEquals("AAPL", found.getSymbol());
    }

    @Test
    void getAssetByIdThrowsWhenMissing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AssetNotFoundException.class, () -> service.getAssetById(99L));
    }

    @Test
    void getAssetsReturnsFirstPage() {
        PageRequest request = PageRequest.of(0, 6);
        when(repository.search("", "", request)).thenReturn(new PageImpl<>(makeAssets(6), request, 14));

        PageResponse result = service.getAssets(0, 6, "", "");

        assertEquals(6, result.getContent().size());
        assertEquals(14, result.getTotalElements());
        assertEquals(3, result.getTotalPages());
        assertEquals(0, result.getPage());
    }

    @Test
    void getAssetsReturnsPartialLastPage() {
        PageRequest request = PageRequest.of(2, 6);
        when(repository.search("", "", request)).thenReturn(new PageImpl<>(makeAssets(2), request, 14));

        PageResponse result = service.getAssets(2, 6, "", "");

        assertEquals(2, result.getContent().size());
        assertEquals(2, result.getPage());
    }

    @Test
    void getAssetsReturnsEmptyWhenPageIsTooHigh() {
        PageRequest request = PageRequest.of(9, 6);
        when(repository.search("", "", request)).thenReturn(new PageImpl<>(new ArrayList<Asset>(), request, 14));

        PageResponse result = service.getAssets(9, 6, "", "");

        assertTrue(result.getContent().isEmpty());
        assertEquals(14, result.getTotalElements());
    }

    @Test
    void getAssetsUsesDefaultSizeWhenSizeIsInvalid() {
        PageRequest request = PageRequest.of(0, 6);
        when(repository.search("", "", request)).thenReturn(new PageImpl<>(makeAssets(6), request, 14));

        PageResponse result = service.getAssets(0, 0, "", "");

        assertEquals(6, result.getSize());
        verify(repository).search("", "", request);
    }

    @Test
    void getAssetsUsesFirstPageWhenPageIsNegative() {
        PageRequest request = PageRequest.of(0, 6);
        when(repository.search("", "", request)).thenReturn(new PageImpl<>(makeAssets(6), request, 14));

        PageResponse result = service.getAssets(-3, 6, "", "");

        assertEquals(0, result.getPage());
        verify(repository).search("", "", request);
    }

    @Test
    void getAssetsPassesSearchTextAndTypeToTheRepository() {
        PageRequest request = PageRequest.of(0, 6);
        when(repository.search("tesla", "Stock", request))
                .thenReturn(new PageImpl<>(List.of(makeAsset(3L, "TSLA", "Stock")), request, 1));

        PageResponse result = service.getAssets(0, 6, "tesla", "Stock");

        assertEquals(1, result.getContent().size());
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void updateAssetSavesWithTheGivenId() {
        Asset changes = makeAsset(null, "AAPL", "Stock");
        when(repository.findById(1L)).thenReturn(Optional.of(makeAsset(1L, "AAPL", "Stock")));
        when(repository.findBySymbolIgnoreCase("AAPL")).thenReturn(Optional.of(makeAsset(1L, "AAPL", "Stock")));
        when(repository.save(changes)).thenReturn(changes);

        Asset updated = service.updateAsset(1L, changes);

        assertEquals(1L, updated.getId());
        verify(repository).save(changes);
    }

    @Test
    void updateAssetThrowsWhenMissing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(AssetNotFoundException.class,
                () -> service.updateAsset(99L, makeAsset(null, "XYZ", "Stock")));
        verify(repository, never()).save(any());
    }

    @Test
    void updateAssetWithSymbolOfAnotherAssetThrowsException() {
        Asset changes = makeAsset(null, "MSFT", "Stock");
        when(repository.findById(1L)).thenReturn(Optional.of(makeAsset(1L, "AAPL", "Stock")));
        when(repository.findBySymbolIgnoreCase("MSFT")).thenReturn(Optional.of(makeAsset(2L, "MSFT", "Stock")));

        assertThrows(DuplicateSymbolException.class, () -> service.updateAsset(1L, changes));
        verify(repository, never()).save(any());
    }

    @Test
    void deleteAssetCallsRepository() {
        when(repository.existsById(1L)).thenReturn(true);

        service.deleteAsset(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void deleteAssetThrowsWhenMissing() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThrows(AssetNotFoundException.class, () -> service.deleteAsset(99L));
        verify(repository, never()).deleteById(any());
    }
}
