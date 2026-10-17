package com.se411.finance.controller;

import com.se411.finance.dto.PageResponse;
import com.se411.finance.model.Asset;
import com.se411.finance.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService service;

    public AssetController(AssetService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Asset addAsset(@Valid @RequestBody Asset asset) {
        return service.addAsset(asset);
    }

    @GetMapping("/{id}")
    public Asset getAssetById(@PathVariable Long id) {
        return service.getAssetById(id);
    }

    @GetMapping
    public PageResponse getAssets(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "6") int size,
                                  @RequestParam(defaultValue = "") String search,
                                  @RequestParam(defaultValue = "") String type) {
        return service.getAssets(page, size, search, type);
    }

    @PutMapping("/{id}")
    public Asset updateAsset(@PathVariable Long id, @Valid @RequestBody Asset asset) {
        return service.updateAsset(id, asset);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAsset(@PathVariable Long id) {
        service.deleteAsset(id);
    }
}
