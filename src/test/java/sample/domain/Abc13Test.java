package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc13Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc13.class);
        Abc13 abc131 = new Abc13();
        abc131.setId(1L);
        Abc13 abc132 = new Abc13();
        abc132.setId(abc131.getId());
        assertThat(abc131).isEqualTo(abc132);
        abc132.setId(2L);
        assertThat(abc131).isNotEqualTo(abc132);
        abc131.setId(null);
        assertThat(abc131).isNotEqualTo(abc132);
    }
}
