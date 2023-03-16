package com.fnd.virgo.controller;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.model.Searcher;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.service.BasicService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@Validated
public interface BasicController<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>, S extends BasicService<C, D, R>> {

    S getService();

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private List<D> getAll(JwtAuthenticationToken jwtAuthenticationToken) {
        return getService().getAll(jwtAuthenticationToken);
    }

    @PostMapping(value = {"/searcher", "/searcher/"}, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Page<D> searcher(@RequestBody Searcher searcher, JwtAuthenticationToken jwtAuthenticationToken) {
        return getService().search(searcher, jwtAuthenticationToken);
    }
}
