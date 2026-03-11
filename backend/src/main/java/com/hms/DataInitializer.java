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
            admin.setEmail("admin@hms.com");
            admin.setPassword("admin123");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // Doctor 1 - Cardiology
            User doctor1 = new User();
            doctor1.setName("Dr. Arjun Sharma");
            doctor1.setEmail("arjun.sharma@hms.com");
            doctor1.setPassword("doctor123");
            doctor1.setRole(Role.DOCTOR);
            doctor1.setSpecialization("Cardiology");
            doctor1.setDepartment("Cardiology Dept");
            doctor1.setFee(600.0);
            doctor1.setExperience("12 years");
            List<AvailableSlot> slots1 = new ArrayList<>();
            slots1.add(new AvailableSlot(LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(12, 0)));
            slots1.add(new AvailableSlot(LocalDate.now().plusDays(1), LocalTime.of(14, 0), LocalTime.of(17, 0)));
            doctor1.setAvailableSlots(slots1);
            userRepository.save(doctor1);

            // Doctor 2 - Pediatrics
            User doctor2 = new User();
            doctor2.setName("Dr. Priya Patel");
            doctor2.setEmail("priya.patel@hms.com");
            doctor2.setPassword("doctor123");
            doctor2.setRole(Role.DOCTOR);
            doctor2.setSpecialization("Pediatrics");
            doctor2.setDepartment("Pediatrics Dept");
            doctor2.setFee(400.0);
            doctor2.setExperience("8 years");
            List<AvailableSlot> slots2 = new ArrayList<>();
            slots2.add(new AvailableSlot(LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(13, 0)));
            slots2.add(new AvailableSlot(LocalDate.now().plusDays(2), LocalTime.of(9, 0), LocalTime.of(12, 0)));
            doctor2.setAvailableSlots(slots2);
            userRepository.save(doctor2);

            // Doctor 3 - Neurology
            User doctor3 = new User();
            doctor3.setName("Dr. Ravi Kumar");
            doctor3.setEmail("ravi.kumar@hms.com");
            doctor3.setPassword("doctor123");
            doctor3.setRole(Role.DOCTOR);
            doctor3.setSpecialization("Neurology");
            doctor3.setDepartment("Neurology Dept");
            doctor3.setFee(750.0);
            doctor3.setExperience("15 years");
            List<AvailableSlot> slots3 = new ArrayList<>();
            slots3.add(new AvailableSlot(LocalDate.now(), LocalTime.of(11, 0), LocalTime.of(14, 0)));
            slots3.add(new AvailableSlot(LocalDate.now().plusDays(1), LocalTime.of(16, 0), LocalTime.of(18, 0)));
            doctor3.setAvailableSlots(slots3);
            userRepository.save(doctor3);

            // Doctor 4 - Orthopedics
            User doctor4 = new User();
            doctor4.setName("Dr. Sunita Verma");
            doctor4.setEmail("sunita.verma@hms.com");
            doctor4.setPassword("doctor123");
            doctor4.setRole(Role.DOCTOR);
            doctor4.setSpecialization("Orthopedics");
            doctor4.setDepartment("Orthopedics Dept");
            doctor4.setFee(550.0);
            doctor4.setExperience("10 years");
            List<AvailableSlot> slots4 = new ArrayList<>();
            slots4.add(new AvailableSlot(LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(11, 0)));
            slots4.add(new AvailableSlot(LocalDate.now().plusDays(3), LocalTime.of(14, 0), LocalTime.of(17, 0)));
            doctor4.setAvailableSlots(slots4);
            userRepository.save(doctor4);

            // Doctor 5 - Dermatology
            User doctor5 = new User();
            doctor5.setName("Dr. Meera Reddy");
            doctor5.setEmail("meera.reddy@hms.com");
            doctor5.setPassword("doctor123");
            doctor5.setRole(Role.DOCTOR);
            doctor5.setSpecialization("Dermatology");
            doctor5.setDepartment("Dermatology Dept");
            doctor5.setFee(350.0);
            doctor5.setExperience("6 years");
            List<AvailableSlot> slots5 = new ArrayList<>();
            slots5.add(new AvailableSlot(LocalDate.now(), LocalTime.of(13, 0), LocalTime.of(16, 0)));
            slots5.add(new AvailableSlot(LocalDate.now().plusDays(2), LocalTime.of(10, 0), LocalTime.of(13, 0)));
            doctor5.setAvailableSlots(slots5);
            userRepository.save(doctor5);

            // Patient
            User patient = new User();
            patient.setName("John Doe");
            patient.setEmail("john.doe@hms.com");
            patient.setPassword("patient123");
            patient.setRole(Role.PATIENT);
            userRepository.save(patient);

            System.out.println("Initial data seeded with 5 doctors, 1 admin, 1 patient.");
        }
    }
}
