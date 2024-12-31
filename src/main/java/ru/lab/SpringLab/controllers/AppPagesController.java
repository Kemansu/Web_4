package ru.lab.SpringLab.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/SpringApp")
public class AppPagesController {

    @GetMapping("/registrationPage")
    public String registrationPage(){
        return "registrationPage";
    }

    @GetMapping("/firstPage")
    public String firstPage(){
        return "firstPage";
    }

    @GetMapping("/secondPage")
    public String secondPage(){
        return "secondPage";
    }
}
