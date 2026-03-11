package com.hms.repository;

import com.hms.entity.User;
import com.hms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(Role role);
    List<User> findByRoleAndSpecializationContainingIgnoreCase(Role role, String specialization);
}
