package com.example.multi_management.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Forward all non-API and non-static-file paths to index.html
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }

    // Also forward nested paths if needed, but the regex above handles single
    // level.
    // To handle deeper paths like /stock/items, we might need a broader pattern or
    // specific forwards.
    // For simple SPAs, matching everything that is NOT an api call is key.
    // Let's use a more robust regex or separate mappings if needed.
    // simpler approach often used:

    @RequestMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
