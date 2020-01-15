package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.Services.MatchConflictException;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.EntityNotFoundException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ErrorController extends ResponseEntityExceptionHandler {

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatus status,
      WebRequest request) {
    HashMap<String, String> errors = new HashMap<>();
    ex.getBindingResult()
        .getAllErrors()
        .forEach(
            (error) -> {
              String fieldName = ((FieldError) error).getField();
              String errorMessage = error.getDefaultMessage();
              errors.put(fieldName, errorMessage);
              System.out.println(errors.toString());
            });

    return new ResponseEntity<>(errors, new HttpHeaders(), HttpStatus.BAD_REQUEST);
  }

  @Override
  protected ResponseEntity<Object> handleMissingServletRequestParameter(
      MissingServletRequestParameterException ex,
      HttpHeaders headers,
      HttpStatus status,
      WebRequest request) {

    String param = ex.getParameterName();
    Map<String, String> json = new HashMap<>();
    json.put("error", param + " is a required parameter for this request");
    return new ResponseEntity<>(json, new HttpHeaders(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  protected ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex) {
    Map<String, String> json = new HashMap<>();
    json.put("error", ex.getLocalizedMessage());
    return new ResponseEntity<>(json, new HttpHeaders(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MatchConflictException.class)
  protected ResponseEntity<Object> handleMatchConflictException(MatchConflictException ex) {
    Map<String, String> json = new HashMap<>();
    json.put("error", ex.getLocalizedMessage());
    return new ResponseEntity<>(json, new HttpHeaders(), HttpStatus.CONFLICT);
  }

  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
      HttpMessageNotReadableException ex,
      HttpHeaders headers,
      HttpStatus status,
      WebRequest request) {
    Map<String, String> json = new HashMap<>();
    json.put("error", "Required request body is missing");
    return new ResponseEntity<>(json, new HttpHeaders(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(EmptyResultDataAccessException.class)
  protected ResponseEntity<Object> handelEmptyResultDataAccessException() {
    Map<String, String> json = new HashMap<>();
    json.put("error", "The requested data could not be found");
    return new ResponseEntity<>(json, new HttpHeaders(), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(EntityNotFoundException.class)
  protected ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException ex) {
    Map<String, String> json = new HashMap<>();
    json.put("error", ex.getMessage());
    return new ResponseEntity<>(json, new HttpHeaders(), HttpStatus.NOT_FOUND);
  }
}
