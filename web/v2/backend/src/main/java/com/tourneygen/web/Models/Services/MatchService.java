package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.MatchDTO;
import com.tourneygen.web.Models.DTOs.MatchReportDTO;
import java.util.List;

public interface MatchService {

  MatchDTO create(MatchDTO matchDTO);

  List<MatchDTO> findMatch(long id);

  void deleteMatch(long id);

  MatchReportDTO reportMatch(MatchReportDTO reportDTO) throws MatchConflictException;

  MatchReportDTO resolveConflict(MatchReportDTO reportDTO);
}
