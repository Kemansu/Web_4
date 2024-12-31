package ru.lab.SpringLab.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.lab.SpringLab.models.Result;
import ru.lab.SpringLab.models.User;
import ru.lab.SpringLab.repositories.ResultRepository;
import ru.lab.SpringLab.repositories.UsersRepository;
import ru.lab.SpringLab.util.UserAlreadyExistsException;

import java.time.LocalDate;

@Service
@Transactional(readOnly = true)
public class AppService {

    private final ResultRepository resultRepository;
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AppService(ResultRepository resultRepository, UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.resultRepository = resultRepository;
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<Result> getResults(Pageable pageable) {
        return resultRepository.findAll(pageable);
    }

    @Transactional
    public void saveResult(Result result) {
        result.setResult(isHit(result.getX(), Double.parseDouble(result.getY()), result.getR()));
        result.setCreatedAt(LocalDate.now());
        resultRepository.save(result);
    }

    @Transactional
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            usersRepository.save(user);
        } catch (Exception e){
            throw new UserAlreadyExistsException();
        }
    }

    public boolean isHit(double x, double y, double r) {
        return ((-x -y <= r) & x <= 0 & y <= 0) || ((x * x + y * y <= r * r / 4) & x >= 0 & y <= 0) || (y >= 0 & y <= r/2 & x <= 0 & x >= -r);
    }

}