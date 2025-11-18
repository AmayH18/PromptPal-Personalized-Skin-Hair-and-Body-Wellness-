package promptpal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import promptpal.backend.entity.UserResult;
import java.util.List;

public interface UserResultRepository extends JpaRepository<UserResult, Long> {
	List<UserResult> findByUser_IdOrderByGenerationTimeDesc(Long userId);

}

	


