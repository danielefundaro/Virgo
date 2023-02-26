package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.Audit;
import com.fnd.virgo.entity.AuditTuple;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.model.Searcher;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.service.CommonService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public abstract class CommonServiceImpl<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> implements CommonService<C, D, R> {
    private final AuditRepository auditRepository;
    private final ModelMapper modelMapper;

    @Autowired
    protected CommonServiceImpl(AuditRepository auditRepository) {
        this.modelMapper = new ModelMapper();
        this.auditRepository = auditRepository;
    }

    @Override
    public List<D> getAll() {
        String userId = "a";
        List<C> cList = getRepository().findAllByUserId(userId);

        // Save the audit info into db
        String info = String.format("The user %s got all %ss. Count %s", userId, getClassEntity().getSimpleName(), cList.size());
        saveAuditInfo(cList.stream().map(CommonFields::getId).collect(Collectors.toList()), userId, AuditTypeEnum.SELECT_ALL, info);

        return cList.stream().map(c -> modelMapper.map(c, getClassDTO())).collect(Collectors.toList());
    }

    @Override
    public D getById(Long id) {
        String userId = "a";
        C c = findEntity(id, userId);

        if (c == null) {
            String error = String.format("The user %s didn't find the %s while searching it with id %s", userId, getClassEntity().getSimpleName(), id);
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        String info = String.format("The user %s got the %s with id %s", userId, getClassEntity().getSimpleName(), id);
        saveAuditInfo(c.getId(), userId, AuditTypeEnum.SELECT, info);

        return modelMapper.map(c, getClassDTO());
    }

    @Override
    public D save(@NotNull D d) {
        String userId = "a";
        C c = findEntity(d, userId);

        if (c != null) {
            String error = String.format("The user %s found the %s while saving it with id %s", userId, getClassEntity().getSimpleName(), c.getId());
            saveAuditInfo(c.getId(), userId, AuditTypeEnum.ERROR, error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        return saveEntity(d, userId, AuditTypeEnum.SAVE);
    }

    @Override
    public List<D> search(@NotNull Searcher searcher) {
        String userId = "a";
        List<Sort.Order> orders = new ArrayList<>();
        int pageNumber = searcher.pageNumber() == null || searcher.pageNumber() < 0 ? 0 : searcher.pageNumber();
        int pageSize = searcher.pageSize() == null || searcher.pageSize() < 0 ? 0 : searcher.pageSize();

        if (searcher.sort() != null && !searcher.sort().isEmpty()) {
            orders = searcher.sort().stream().filter(Objects::nonNull).filter(s -> !s.isBlank()).map(s -> switch (s.charAt(0)) {
                case '-' -> new Sort.Order(Sort.Direction.DESC, s.substring(1));
                case '+' -> new Sort.Order(Sort.Direction.ASC, s.substring(1));
                default -> new Sort.Order(Sort.Direction.ASC, s.isBlank() ? "id" : s);
            }).toList();

            if (!checkFields(orders)) {
                String info = String.format("The user %s entered the wrong sort fields %s", userId, orders.stream().map(Sort.Order::getProperty).collect(Collectors.joining(", ")));
                saveAuditInfo(userId, info);

                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sort fields not resolve");
            }
        } else {
            orders.add(new Sort.Order(Sort.Direction.ASC, "id"));
        }

        Sort sort = Sort.by(orders);
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sort);
        Page<C> cPage = findAllByFilter(searcher.value(), userId, pageRequest);

        // Save the audit info into db
        String info = String.format("The user %s got all object %s with ids %s. Count %s; total elements %s; total pages %s", userId, getClassEntity().getSimpleName(), cPage.stream().map(CommonFields::getId).toList(), cPage.getNumberOfElements(), cPage.getTotalElements(), cPage.getTotalPages());
        saveAuditInfo(cPage.stream().map(CommonFields::getId).collect(Collectors.toList()), userId, AuditTypeEnum.SEARCH, info);

        return cPage.stream().map(c -> modelMapper.map(c, getClassDTO())).collect(Collectors.toList());
    }

    @Override
    public D update(@NotNull D d) {
        String userId = "a";
        C cOld = findEntity(d.getId(), userId), cNew = findEntity(d, userId);

        if (cOld == null) {
            String error = String.format("The user %s didn't find the %s while updating it with id %s", userId, getClassEntity().getSimpleName(), d.getId());
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        if (cNew != null && !cNew.getId().equals(cOld.getId())) {
            String error = String.format("The user %s found the %s while updating it with id %s", userId, getClassEntity().getSimpleName(), cNew.getId());
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        return saveEntity(d, userId, AuditTypeEnum.UPDATE);
    }

    @Override
    public D delete(Long id) {
        String userId = "a";
        C c = findEntity(id, userId);

        if (c == null) {
            String error = String.format("The user %s didn't find the %s while deleting it with id %s", userId, getClassEntity().getSimpleName(), id);
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        c.setDeleted(true);
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s deleted the %s with id %s", userId, getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(c.getId(), userId, AuditTypeEnum.DELETE, info);

        return modelMapper.map(c, getClassDTO());
    }

    protected void saveAuditInfo(String userId, String description) {
        saveAuditInfo((List<Long>) null, userId, AuditTypeEnum.ERROR, description);
    }

    protected void saveAuditInfo(Long id, String userId, AuditTypeEnum auditTypeEnum, String description) {
        saveAuditInfo(Collections.singletonList(id), userId, auditTypeEnum, description);
    }

    protected void saveAuditInfo(List<Long> ids, String userId, AuditTypeEnum auditTypeEnum, String description) {
        Audit audit = new Audit();
        Date now = new Date();

        audit.setDate(now);
        audit.setUserId(userId);
        audit.setType(auditTypeEnum);
        audit.setTableName(getClassEntity().getSimpleName());
        audit.setDescription(description);

        if (ids != null) {
            audit.setTuples(ids.stream().map(id -> {
                AuditTuple auditTuple = new AuditTuple();

                auditTuple.setDate(now);
                auditTuple.setAudit(audit);
                auditTuple.setTupleId(id);

                return auditTuple;
            }).collect(Collectors.toList()));
        }

        auditRepository.save(audit);

        if (auditTypeEnum == AuditTypeEnum.ERROR)
            log.error(description);
        else
            log.info(description);
    }

    private C findEntity(Long id, String userId) {
        Optional<C> optional = getRepository().findByIdAndUserId(id, userId);
        return optional.orElse(null);
    }

    private D saveEntity(D d, String userId, @NotNull AuditTypeEnum auditTypeEnum) {
        C c = modelMapper.map(d, getClassEntity());
        c.setUserId(userId);
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s %sd the %s with id %s", userId, auditTypeEnum.name().toLowerCase(), getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(c.getId(), userId, auditTypeEnum, info);

        return modelMapper.map(c, getClassDTO());
    }

    private boolean checkFields(@NotNull List<Sort.Order> orders) {
        Class<?> clazz = getClassDTO();
        int count = 0;

        do {
            Class<?> finalClazz = clazz;

            for (Sort.Order order : orders) {
                if (Arrays.stream(finalClazz.getDeclaredFields()).anyMatch(field -> field.getName().equals(order.getProperty()))) {
                    count++;
                }
            }

            clazz = clazz.getSuperclass();
        } while (clazz != null && count < orders.size());

        return count == orders.size();
    }
}
