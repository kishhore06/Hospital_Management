package com.hms;

import com.hms.entity.AvailableSlot;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Admin
            User admin = new User();
            admin.setName("Admin One");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // Doctors
            User doctor1 = new User();
            doctor1.setName("Dr. Smith");
            doctor1.setRole(Role.DOCTOR);
            doctor1.setSpecialization("Cardiology");
            doctor1.setDepartment("Cardiology Dept");
            doctor1.setFee(500.0);
            
            List<AvailableSlot> slots1 = new ArrayList<>();
            slots1.add(new AvailableSlot(LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(12, 0)));
            slots1.add(new AvailableSlot(LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(17, 0)));
            doctor1.setAvailableSlots(slots1);
            userRepository.save(doctor1);

            User doctor2 = new User();
            doctor2.setName("Dr. Jones");
            doctor2.setRole(Role.DOCTOR);
            doctor2.setSpecialization("Pediatrics");
            doctor2.setDepartment("Pediatrics Dept");
            doctor2.setFee(300.0);
            
            List<AvailableSlot> slots2 = new ArrayList<>();
            slots2.add(new AvailableSlot(LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(13, 0)));
            doctor2.setAvailableSlots(slots2);
            userRepository.save(doctor2);

            // Patient
            User patient = new User();
            patient.setName("John Doe");
            patient.setRole(Role.PATIENT);
            userRepository.save(patient);
            
            System.out.println("Initial data seeded.");
        }
    }
}
