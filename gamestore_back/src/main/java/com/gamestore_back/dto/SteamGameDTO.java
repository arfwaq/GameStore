package com.gamestore_back.dto;

/**
 * DTO for individual game data from the Steam API.
 */
public class SteamGameDTO {
    private int appid;
    private String name;

    public int getAppid() {
        return appid;
    }

    public void setAppid(int appid) {
        this.appid = appid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
