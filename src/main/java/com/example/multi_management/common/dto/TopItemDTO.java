package com.example.multi_management.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopItemDTO {
    private String itemName;
    private Double quantity;
}
