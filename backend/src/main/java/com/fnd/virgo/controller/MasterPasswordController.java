package com.fnd.virgo.controller;

import com.fnd.virgo.dto.MasterPasswordDTO;
import com.fnd.virgo.service.MasterPasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "master-password")
@Validated
public class MasterPasswordController {

    private final MasterPasswordService masterPasswordService;

    public MasterPasswordController(MasterPasswordService masterPasswordService) {
        this.masterPasswordService = masterPasswordService;
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public MasterPasswordDTO get(JwtAuthenticationToken jwtAuthenticationToken) {
        return this.masterPasswordService.get(jwtAuthenticationToken);
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    public MasterPasswordDTO save(@RequestBody MasterPasswordDTO masterPasswordDTO, JwtAuthenticationToken jwtAuthenticationToken) {
        return this.masterPasswordService.save(masterPasswordDTO, jwtAuthenticationToken);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public MasterPasswordDTO update(@RequestBody MasterPasswordDTO masterPasswordDTO, JwtAuthenticationToken jwtAuthenticationToken) {
        return this.masterPasswordService.update(masterPasswordDTO, jwtAuthenticationToken);
    }
}
