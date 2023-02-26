package com.fnd.virgo.model;

import java.util.List;

public record Searcher(String value, Integer pageNumber, Integer pageSize, List<String> sort) {
}
