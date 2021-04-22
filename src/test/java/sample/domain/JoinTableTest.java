package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class JoinTableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JoinTable.class);
        JoinTable joinTable1 = new JoinTable();
        joinTable1.setId(1L);
        JoinTable joinTable2 = new JoinTable();
        joinTable2.setId(joinTable1.getId());
        assertThat(joinTable1).isEqualTo(joinTable2);
        joinTable2.setId(2L);
        assertThat(joinTable1).isNotEqualTo(joinTable2);
        joinTable1.setId(null);
        assertThat(joinTable1).isNotEqualTo(joinTable2);
    }
}
