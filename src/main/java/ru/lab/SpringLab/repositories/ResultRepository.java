package ru.lab.SpringLab.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.cdi.Eager;
import org.springframework.stereotype.Repository;
import ru.lab.SpringLab.models.Result;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
}
