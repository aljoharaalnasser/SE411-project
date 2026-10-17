package com.se411.finance.controller;

import com.se411.finance.dto.PageResponse;
import com.se411.finance.exception.AssetNotFoundException;
import com.se411.finance.exception.DuplicateSymbolException;
import com.se411.finance.model.Asset;
import com.se411.finance.service.AssetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AssetController.class)
class AssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AssetService service;

    private final String validJson = """
            {
              "symbol": "GOOG",
              "company": "Alphabet Inc.",
              "type": "Stock",
              "quantity": 5,
              "marketValue": 701.25
            }
            """;

    private Asset makeAsset(Long id, String symbol) {
        return new Asset(id, symbol, "Alphabet Inc.", "Stock", 5, 701.25);
    }

    @Test
    void postCreatesAsset() throws Exception {
        when(service.addAsset(any(Asset.class))).thenReturn(makeAsset(11L, "GOOG"));

        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.symbol").value("GOOG"));
    }

    @Test
    void postWithInvalidDataReturns400() throws Exception {
        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"symbol\": \"\", \"type\": \"Gold\", \"quantity\": 0}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void postWithMissingMarketValueReturns400WithMessage() throws Exception {
        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"symbol\": \"GOOG\", \"company\": \"Alphabet\", \"type\": \"Stock\", \"quantity\": 5}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Market value is required"));
    }

    @Test
    void postWithBrokenJsonReturns400() throws Exception {
        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("this is not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Request body is missing or not valid"));
    }

    @Test
    void postWithDuplicateSymbolReturns409() throws Exception {
        when(service.addAsset(any(Asset.class))).thenThrow(new DuplicateSymbolException("GOOG"));

        mockMvc.perform(post("/api/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Symbol GOOG already exists"));
    }

    @Test
    void getByIdReturnsAsset() throws Exception {
        when(service.getAssetById(1L)).thenReturn(makeAsset(1L, "AAPL"));

        mockMvc.perform(get("/api/assets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.symbol").value("AAPL"));
    }

    @Test
    void getByIdReturns404WhenMissing() throws Exception {
        when(service.getAssetById(99L)).thenThrow(new AssetNotFoundException(99L));

        mockMvc.perform(get("/api/assets/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Asset with id 99 not found"));
    }

    @Test
    void getAllReturnsPage() throws Exception {
        List<Asset> content = List.of(makeAsset(1L, "AAPL"), makeAsset(2L, "MSFT"));
        when(service.getAssets(0, 2, "", "")).thenReturn(new PageResponse(content, 0, 2, 10, 5));

        mockMvc.perform(get("/api/assets?page=0&size=2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(10))
                .andExpect(jsonPath("$.totalPages").value(5))
                .andExpect(jsonPath("$.page").value(0));
    }

    @Test
    void getAllUsesDefaultPageAndSize() throws Exception {
        when(service.getAssets(0, 6, "", "")).thenReturn(new PageResponse(List.of(), 0, 6, 0, 0));

        mockMvc.perform(get("/api/assets"))
                .andExpect(status().isOk());

        verify(service).getAssets(0, 6, "", "");
    }

    @Test
    void getAllPassesSearchAndType() throws Exception {
        when(service.getAssets(0, 6, "apple", "Stock")).thenReturn(new PageResponse(List.of(), 0, 6, 0, 0));

        mockMvc.perform(get("/api/assets?search=apple&type=Stock"))
                .andExpect(status().isOk());

        verify(service).getAssets(0, 6, "apple", "Stock");
    }

    @Test
    void putUpdatesAsset() throws Exception {
        when(service.updateAsset(eq(1L), any(Asset.class))).thenReturn(makeAsset(1L, "GOOG"));

        mockMvc.perform(put("/api/assets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.symbol").value("GOOG"));
    }

    @Test
    void putReturns404WhenMissing() throws Exception {
        when(service.updateAsset(eq(99L), any(Asset.class))).thenThrow(new AssetNotFoundException(99L));

        mockMvc.perform(put("/api/assets/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/assets/1"))
                .andExpect(status().isNoContent());

        verify(service).deleteAsset(1L);
    }

    @Test
    void deleteReturns404WhenMissing() throws Exception {
        doThrow(new AssetNotFoundException(99L)).when(service).deleteAsset(99L);

        mockMvc.perform(delete("/api/assets/99"))
                .andExpect(status().isNotFound());
    }
}
