package com.se411.finance.dto;

import java.util.List;

public class PageResponse {

    private List<?> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public PageResponse(List<?> content, int page, int size, long totalElements, int totalPages) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public List<?> getContent() {
        return content;
    }

    public int getPage() {
        return page;
    }

    public int getSize() {
        return size;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }
}
