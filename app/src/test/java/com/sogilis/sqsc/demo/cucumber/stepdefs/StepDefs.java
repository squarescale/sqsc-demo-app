package com.sogilis.sqsc.demo.cucumber.stepdefs;

import com.sogilis.sqsc.demo.AppApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = AppApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
