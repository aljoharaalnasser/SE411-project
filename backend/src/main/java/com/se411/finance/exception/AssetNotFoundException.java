package com.se411.finance.exception;

public class AssetNotFoundException extends RuntimeException {

    public AssetNotFoundException(Long id) {
        super("Asset with id " + id + " not found");
    }
}
