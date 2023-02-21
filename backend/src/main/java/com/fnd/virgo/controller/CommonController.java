package com.fnd.virgo.controller;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.model.UpdateRequest;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.service.CommonService;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Validated
public interface CommonController<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>, S extends CommonService<C, D, R>> {

    S getService();

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private List<D> getAll() {
        return getService().getAll();
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private D save(@RequestBody D d) {
        return getService().save(d);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private D update(@NotNull @RequestBody UpdateRequest<D> d) {
        return getService().update(d);
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private D delete(@RequestBody D d) {
        return getService().delete(d);
    }
}
