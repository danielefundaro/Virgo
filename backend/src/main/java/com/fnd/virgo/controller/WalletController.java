package com.fnd.virgo.controller;

import com.fnd.virgo.dto.WalletDTO;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.repository.WalletRepository;
import com.fnd.virgo.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @Override
    public WalletService getService() {
        return this.walletService;
    }

    @GetMapping(value = "/{id}/type/{type}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public WalletDTO getByIdAndType(@PathVariable Long id, @PathVariable String type, JwtAuthenticationToken jwtAuthenticationToken){
        return walletService.getByIdAndType(id, type, jwtAuthenticationToken);
    }
}
