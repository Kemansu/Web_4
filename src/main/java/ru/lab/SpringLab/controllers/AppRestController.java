package ru.lab.SpringLab.controllers;



import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.lab.SpringLab.dto.ResultDTO;
import ru.lab.SpringLab.dto.UserDTO;
import ru.lab.SpringLab.models.Result;
import ru.lab.SpringLab.models.User;
import ru.lab.SpringLab.services.AppService;
import ru.lab.SpringLab.util.UserAlreadyExistsException;
import ru.lab.SpringLab.util.UserErrorResponse;


@RestController
@RequestMapping("/api")
public class AppRestController {
    private final AppService appService;
    private final ModelMapper modelMapper;

    @Autowired
    public AppRestController(AppService appService, ModelMapper modelMapper) {
        this.appService = appService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/new-user")
    public ResponseEntity<String> addUser(@RequestBody UserDTO userDTO) {
        appService.saveUser(convertToUser(userDTO));
        return ResponseEntity.status(HttpStatus.CREATED).body("Пользователь успешно зарегестрирован!");
    }

    @GetMapping("/results")
    public Page<Result> getResults(@RequestParam int page) {
        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by("id").descending());
        return appService.getResults(pageable);
    }


    @PostMapping("/check-point")
    public ResponseEntity<HttpStatus> checker(@RequestBody ResultDTO resultDTO){
        appService.saveResult(converToResult(resultDTO));

        // отправляем Http ответ с пустым телом и со статусом 200
        return ResponseEntity.ok(HttpStatus.OK);
    }

    private Result converToResult(ResultDTO resultDTO) {
        return modelMapper.map(resultDTO, Result.class);
    }

    private User convertToUser(UserDTO userDTO){
        return modelMapper.map(userDTO, User.class);
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(UserAlreadyExistsException e) {
        UserErrorResponse response = new UserErrorResponse(
                "Пользователь с такими данными уже сущесвтует",
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
