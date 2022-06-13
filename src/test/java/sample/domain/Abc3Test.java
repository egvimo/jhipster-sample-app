package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc3Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc3.class);
        Abc3 abc31 = new Abc3();
        abc31.setId(1L);
        Abc3 abc32 = new Abc3();
        abc32.setId(abc31.getId());
        assertThat(abc31).isEqualTo(abc32);
        abc32.setId(2L);
        assertThat(abc31).isNotEqualTo(abc32);
        abc31.setId(null);
        assertThat(abc31).isNotEqualTo(abc32);
    }
}
