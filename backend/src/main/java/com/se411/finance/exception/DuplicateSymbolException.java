package com.se411.finance.exception;

public class DuplicateSymbolException extends RuntimeException {

    public DuplicateSymbolException(String symbol) {
        super("Symbol " + symbol + " already exists");
    }
}
