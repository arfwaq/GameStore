package com.gamestore_back.service;

import java.util.List;

public interface SteamGameService {
    /**
     * Fetch the top 100 game App IDs from the Steam API.
     *
     * @return List of top 100 game App IDs as Strings.
     */
    List<String> fetchTop100GameAppIds();
}
