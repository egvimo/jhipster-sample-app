package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc7Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc7.class);
        Abc7 abc71 = new Abc7();
        abc71.setId(1L);
        Abc7 abc72 = new Abc7();
        abc72.setId(abc71.getId());
        assertThat(abc71).isEqualTo(abc72);
        abc72.setId(2L);
        assertThat(abc71).isNotEqualTo(abc72);
        abc71.setId(null);
        assertThat(abc71).isNotEqualTo(abc72);
    }
}
