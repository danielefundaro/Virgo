package com.fnd.virgo.controller;

import com.fnd.virgo.dto.CredentialDetailsDTO;
import com.fnd.virgo.service.CredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "credentials")
@Validated
public class CredentialController {
    private final CredentialService credentialService;

    @Autowired
    public CredentialController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private List<CredentialDetailsDTO> getAll() {
        return credentialService.getAll();
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private CredentialDetailsDTO save(@RequestBody CredentialDetailsDTO credentialDetailsDTO) {
        return credentialService.save(credentialDetailsDTO);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private CredentialDetailsDTO update(@RequestBody CredentialDetailsDTO credentialDetailsDTO) {
        return credentialService.update(credentialDetailsDTO);
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private CredentialDetailsDTO delete(@RequestBody CredentialDetailsDTO credentialDetailsDTO) {
        return credentialService.delete(credentialDetailsDTO);
    }
}
