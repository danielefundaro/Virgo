package com.fnd.virgo.controller;

import com.fnd.virgo.dto.WalletDTO;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.repository.WalletRepository;
import com.fnd.virgo.service.WalletService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "wallets")
@Validated
public class WalletController implements BasicController<Wallet, WalletDTO, WalletRepository, WalletService> {
    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @Override
    public WalletService getService() {
        return this.walletService;
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public WalletDTO getById(@PathVariable Long id, JwtAuthenticationToken jwtAuthenticationToken) {
        return walletService.getById(id, jwtAuthenticationToken);
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    public WalletDTO save(@RequestBody WalletDTO walletDTO, JwtAuthenticationToken jwtAuthenticationToken) {
        return walletService.save(walletDTO, jwtAuthenticationToken);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public WalletDTO update(@RequestBody WalletDTO walletDTO, JwtAuthenticationToken jwtAuthenticationToken) {
        return walletService.update(walletDTO, jwtAuthenticationToken);
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public WalletDTO delete(@PathVariable Long id, JwtAuthenticationToken jwtAuthenticationToken) {
        return walletService.delete(id, jwtAuthenticationToken);
    }
}
