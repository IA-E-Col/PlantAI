package ird.sup.projectmanagementservice.Services;


import ird.sup.projectmanagementservice.DAO.MediaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MediaService {

    @Autowired
    private MediaRepository pr;

}
