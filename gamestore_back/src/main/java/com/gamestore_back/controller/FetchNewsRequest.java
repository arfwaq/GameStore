package com.gamestore_back.controller;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class FetchNewsRequest {

    @JsonProperty("appIds") // Matches the JSON field "appIds"
    private List<String> appIds;

    public List<String> getAppIds() {
        return appIds;
    }

    public void setAppIds(List<String> appIds) {
        this.appIds = appIds;
    }

    @Override
    public String toString() {
        return "FetchNewsRequest{" +
                "appIds=" + appIds +
                '}';
    }
}
