package com.example.multi_management.stock.controller;

import com.example.multi_management.stock.entity.Party;
import com.example.multi_management.stock.repository.PartyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
public class PartyController {

    private final PartyRepository partyRepository;

    public PartyController(PartyRepository partyRepository) {
        this.partyRepository = partyRepository;
    }

    @GetMapping
    public List<Party> getAllParties(@RequestParam(required = false) String type) {
        if (type != null) {
            return partyRepository.findByType(type);
        }
        return partyRepository.findAll();
    }

    @PostMapping
    public Party createParty(@RequestBody Party party) {
        return partyRepository.save(party);
    }
}
