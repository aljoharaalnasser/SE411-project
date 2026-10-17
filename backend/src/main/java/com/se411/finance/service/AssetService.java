package com.se411.finance.service;

import com.se411.finance.dto.PageResponse;
import com.se411.finance.exception.AssetNotFoundException;
import com.se411.finance.exception.DuplicateSymbolException;
import com.se411.finance.model.Asset;
import com.se411.finance.repository.AssetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AssetService {

    private final AssetRepository repository;

    public AssetService(AssetRepository repository) {
        this.repository = repository;
    }

    public Asset addAsset(Asset asset) {
        Optional<Asset> existing = repository.findBySymbolIgnoreCase(asset.getSymbol());
        if (existing.isPresent()) {
            throw new DuplicateSymbolException(asset.getSymbol());
        }
        asset.setId(null);
        return repository.save(asset);
    }

    public Asset getAssetById(Long id) {
        Optional<Asset> asset = repository.findById(id);
        if (asset.isEmpty()) {
            throw new AssetNotFoundException(id);
        }
        return asset.get();
    }

    public PageResponse getAssets(int page, int size, String search, String type) {
        if (page < 0) {
            page = 0;
        }
        if (size < 1) {
            size = 6;
        }

        Page<Asset> result = repository.search(search, type, PageRequest.of(page, size));

        return new PageResponse(result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public Asset updateAsset(Long id, Asset asset) {
        getAssetById(id);

        Optional<Asset> sameSymbol = repository.findBySymbolIgnoreCase(asset.getSymbol());
        if (sameSymbol.isPresent() && !sameSymbol.get().getId().equals(id)) {
            throw new DuplicateSymbolException(asset.getSymbol());
        }

        asset.setId(id);
        return repository.save(asset);
    }

    public void deleteAsset(Long id) {
        if (!repository.existsById(id)) {
            throw new AssetNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
