package ru.lab.SpringLab.models;


import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "result")
public class Result {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "x")
    private double x;
    @Column(name = "y")
    private String y;
    @Column(name = "r")
    private double R;
    @Column(name = "result")
    private boolean result;

    @Column(name = "createdat")
    private LocalDate createdat;

    public Result(double x, String y, double r, boolean result, LocalDate createdat) {
        this.x = x;
        this.y = y;
        this.R = r;
        this.result = result;
        this.createdat = createdat;
    }

    public Result() {
    }

    public LocalDate getCreatedat() {
        return createdat;
    }

    public void setCreatedAt(LocalDate createdat) {
        this.createdat = createdat;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }


    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public double getR() {
        return R;
    }

    public void setR(double r) {
        R = r;
    }

    public boolean isResult() {
        return result;
    }

    public void setResult(boolean result) {
        this.result = result;
    }
}
