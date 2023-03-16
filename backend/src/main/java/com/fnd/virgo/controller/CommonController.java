package com.fnd.virgo.controller;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.service.CommonService;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@Validated
public interface CommonController<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>, S extends CommonService<C, D, R>> extends BasicController<C, D, R, S> {

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private D getById(@PathVariable Long id, JwtAuthenticationToken jwtAuthenticationToken) {
        return getService().getById(id, jwtAuthenticationToken);
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private D save(@RequestBody D d, JwtAuthenticationToken jwtAuthenticationToken) {
        return getService().save(d, jwtAuthenticationToken);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private D update(@NotNull @RequestBody D d, JwtAuthenticationToken jwtAuthenticationToken) {
        return getService().update(d, jwtAuthenticationToken);
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private D delete(@PathVariable Long id, JwtAuthenticationToken jwtAuthenticationToken) {
        return getService().delete(id, jwtAuthenticationToken);
    }
}
