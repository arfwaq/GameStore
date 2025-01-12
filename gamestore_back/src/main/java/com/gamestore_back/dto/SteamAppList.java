package com.gamestore_back.dto;

import java.util.List;

/**
 * DTO for mapping the Steam API response for the App List.
 */
public class SteamAppList {
    private Applist applist;

    public Applist getApplist() {
        return applist;
    }

    public void setApplist(Applist applist) {
        this.applist = applist;
    }

    public static class Applist {
        private List<SteamGameDTO> apps;

        public List<SteamGameDTO> getApps() {
            return apps;
        }

        public void setApps(List<SteamGameDTO> apps) {
            this.apps = apps;
        }
    }
}
