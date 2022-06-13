package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc10Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc10.class);
        Abc10 abc101 = new Abc10();
        abc101.setId(1L);
        Abc10 abc102 = new Abc10();
        abc102.setId(abc101.getId());
        assertThat(abc101).isEqualTo(abc102);
        abc102.setId(2L);
        assertThat(abc101).isNotEqualTo(abc102);
        abc101.setId(null);
        assertThat(abc101).isNotEqualTo(abc102);
    }
}
