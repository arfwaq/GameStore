package com.gamestore_back.security;

import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.PlayerDTO;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor//스프링 시큐리티는 사용자의 인증 처리를 위해서 UserDetailsService라는 인터페이스의 구현체를 활용한다.
public class PlayerUserDetailsService implements UserDetailsService{

    private final PlayerRepository playerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("----------------loadUserByUsername-----------------------------");


        Player player = playerRepository.getWithRoles(username);

        if(player == null){
            throw new UsernameNotFoundException("Not Found");
        }

        PlayerDTO playerDTO = new PlayerDTO(
                player.getEmail(),
                player.getPw(),
                player.getNickname(),
                player.isSocial(),
                player.getPlayerRoleList()
                        .stream()
                        .map(playerRole -> playerRole.name()).collect(Collectors.toList()));

        log.info(playerDTO);

        return playerDTO;


    }

}
