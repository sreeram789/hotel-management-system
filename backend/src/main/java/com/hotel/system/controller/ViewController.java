package com.hotel.system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping(value = "/{path:(?!api|static|.*\\..*).*?}")
    public String redirect() {
        return "forward:/index.html";
    }
}
