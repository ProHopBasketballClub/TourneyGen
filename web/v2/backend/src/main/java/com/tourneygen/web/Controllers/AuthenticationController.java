package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.AuthenticationRequest;
import com.tourneygen.web.Models.DTOs.AuthenticationResponse;
import com.tourneygen.web.Services.JwtService;
import com.tourneygen.web.Services.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

  @Autowired private AuthenticationManager authenticationManager;

  @Autowired private MyUserDetailsService userDetailsService;

  @Autowired private JwtService jwtTokenUtil;

  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> createAuthenticationToken(
      @RequestBody AuthenticationRequest authenticationRequest) throws Exception {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(
              authenticationRequest.getUsername(), authenticationRequest.getPassword()));
    } catch (BadCredentialsException ex) {
      throw new BadCredentialsException("Incorrect Password", ex);
    }
    final UserDetails userDetails =
        userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
    final String jwt = jwtTokenUtil.generateToken(userDetails);
    return ResponseEntity.ok(new AuthenticationResponse(jwt));
  }
}
